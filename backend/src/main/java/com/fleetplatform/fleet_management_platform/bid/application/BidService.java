package com.fleetplatform.fleet_management_platform.bid.application;

import com.fleetplatform.fleet_management_platform.bid.api.BidRequest;
import com.fleetplatform.fleet_management_platform.bid.api.BidResponse;
import com.fleetplatform.fleet_management_platform.bid.domain.Bid;
import com.fleetplatform.fleet_management_platform.bid.domain.BidCondition;
import com.fleetplatform.fleet_management_platform.bid.domain.BidRepository;
import com.fleetplatform.fleet_management_platform.bid.domain.BidStatus;
import com.fleetplatform.fleet_management_platform.bid.mapper.BidMapper;
import com.fleetplatform.fleet_management_platform.common.exception.BadRequestException;
import com.fleetplatform.fleet_management_platform.common.exception.ConflictException;
import com.fleetplatform.fleet_management_platform.common.exception.ForbiddenException;
import com.fleetplatform.fleet_management_platform.common.exception.NotFoundException;
import com.fleetplatform.fleet_management_platform.common.exception.UnauthorizedException;
import com.fleetplatform.fleet_management_platform.email.application.EmailService;
import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.job.domain.JobRepository;
import com.fleetplatform.fleet_management_platform.job.domain.JobStatus;
import com.fleetplatform.fleet_management_platform.notification.application.NotificationService;
import com.fleetplatform.fleet_management_platform.notification.domain.NotificationType;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Transactional
    public BidResponse placeBid(BidRequest req, String bidderEmail) {
        if (req.getJobId() == null) {
            throw new BadRequestException("jobId is required");
        }
        if (req.getAmount() == null || req.getAmount().signum() <= 0) {
            throw new BadRequestException("Bid amount must be positive");
        }

        User bidder = userRepository.findByEmail(bidderEmail)
                .orElseThrow(() -> new NotFoundException("Bidder not found"));

        Job job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("Bidding is closed for this job");
        }

        if (job.getAuctionClosesAt() == null || job.getAuctionClosesAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Auction has already closed");
        }

        if (req.getAmount().compareTo(job.getBudgetCeiling()) > 0) {
            throw new BadRequestException("Bid exceeds the budget ceiling");
        }

        if (job.getPoster().getId().equals(bidder.getId())) {
            throw new BadRequestException("Job posters cannot bid on their own jobs");
        }

        BidCondition condition = null;
        if (Boolean.TRUE.equals(req.getSharedLoad())
                || req.getAlternateDeliveryDate() != null
                || (req.getConditionNote() != null && !req.getConditionNote().isBlank())) {
            condition = BidCondition.builder()
                    .sharedLoad(req.getSharedLoad())
                    .alternateDeliveryDate(req.getAlternateDeliveryDate())
                    .conditionNote(req.getConditionNote())
                    .build();
        }

        Bid bid = Bid.builder()
                .job(job)
                .bidder(bidder)
                .amount(req.getAmount())
                .status(BidStatus.PENDING)
                .condition(condition)
                .createdAt(LocalDateTime.now())
                .build();

        try {
            return BidMapper.toResponse(bidRepository.save(bid));
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("You have already placed a bid on this job");
        }
    }

    @Transactional
    public BidResponse awardBid(Long jobId, Long bidId, String requesterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getPoster().getEmail().equals(requesterEmail)) {
            throw new ForbiddenException("Only the job poster can award the job");
        }

        if (job.getStatus() != JobStatus.PENDING_AWARD) {
            throw new BadRequestException("Job is not in PENDING_AWARD status");
        }

        List<Bid> bids = bidRepository.findByJobIdOrderByAmountAsc(jobId);
        Bid winner = bids.stream()
                .filter(b -> b.getId().equals(bidId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Bid not found for this job"));

        if (winner.getCondition() != null && winner.getCondition().getAlternateDeliveryDate() != null) {
            job.setExpectedDeliveryDate(winner.getCondition().getAlternateDeliveryDate());
        }
        job.setStatus(JobStatus.AWARDED);

        for (Bid bid : bids) {
            if (bid.getId().equals(bidId)) {
                bid.setStatus(BidStatus.ACCEPTED);
                String msg = String.format(
                        "Congratulations! Your bid of $%.2f for Job #%d has been accepted.%s",
                        bid.getAmount(), jobId, buildConditionSummary(bid.getCondition()));
                notificationService.create(bid.getBidder(), NotificationType.BID_ACCEPTED, msg, jobId);
                emailService.send(bid.getBidder().getEmail(), "ShipBidder: Your bid was accepted!", msg);
            } else {
                bid.setStatus(BidStatus.REJECTED);
                String msg = String.format(
                        "Job #%d has been awarded to another carrier. Thank you for bidding.", jobId);
                notificationService.create(bid.getBidder(), NotificationType.BID_REJECTED, msg, jobId);
                emailService.send(bid.getBidder().getEmail(),
                        "ShipBidder: Job #" + jobId + " awarded to another carrier", msg);
            }
        }

        return BidMapper.toResponse(winner);
    }

    @Transactional(readOnly = true)
    public Optional<BidResponse> getMyBidForJob(Long jobId, String bidderEmail) {
        return bidRepository.findByJobIdAndBidderEmail(jobId, bidderEmail)
                .map(BidMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getMyBids(String bidderEmail) {
        return bidRepository.findByBidderEmailOrderByCreatedAtDesc(bidderEmail)
                .stream()
                .map(BidMapper::toResponse)
                .toList();
    }

    private String buildConditionSummary(BidCondition condition) {
        if (condition == null || !condition.hasAny()) return "";
        StringBuilder sb = new StringBuilder();
        if (Boolean.TRUE.equals(condition.getSharedLoad())) sb.append("shared load");
        if (condition.getAlternateDeliveryDate() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("delivery by ").append(condition.getAlternateDeliveryDate());
        }
        if (condition.getConditionNote() != null && !condition.getConditionNote().isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(condition.getConditionNote());
        }
        return " Conditions accepted: " + sb + ".";
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidsForJob(Long jobId, String requesterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getPoster().getEmail().equals(requesterEmail)) {
            throw new UnauthorizedException("Only the job poster can view bids");
        }

        return bidRepository.findByJobIdOrderByAmountAsc(jobId)
                .stream()
                .map(BidMapper::toResponse)
                .toList();
    }
}

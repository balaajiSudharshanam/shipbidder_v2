package com.fleetplatform.fleet_management_platform.auction.application;

import com.fleetplatform.fleet_management_platform.bid.domain.Bid;
import com.fleetplatform.fleet_management_platform.bid.domain.BidRepository;
import com.fleetplatform.fleet_management_platform.email.application.EmailService;
import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.job.domain.JobRepository;
import com.fleetplatform.fleet_management_platform.job.domain.JobStatus;
import com.fleetplatform.fleet_management_platform.notification.application.NotificationService;
import com.fleetplatform.fleet_management_platform.notification.domain.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionScheduler {

    private final JobRepository jobRepository;
    private final BidRepository bidRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Value("${app.auction.grace-period-hours:24}")
    private int gracePeriodHours;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void processAuctions() {
        LocalDateTime now = LocalDateTime.now();
        closeExpiredAuctions(now);
        expireUnawarded(now);
    }

    private void closeExpiredAuctions(LocalDateTime now) {
        List<Job> jobs = jobRepository.findByStatusAndAuctionClosesAtBefore(JobStatus.OPEN, now);
        for (Job job : jobs) {
            job.setStatus(JobStatus.PENDING_AWARD);
            List<Bid> bids = bidRepository.findByJobIdOrderByAmountAsc(job.getId());
            for (Bid bid : bids) {
                String msg = String.format(
                        "The auction for Job #%d has closed. The job poster is now selecting a winner.", job.getId());
                notificationService.create(bid.getBidder(), NotificationType.AUCTION_CLOSED, msg, job.getId());
                emailService.send(bid.getBidder().getEmail(),
                        "ShipBidder: Auction closed for Job #" + job.getId(), msg);
            }
            log.info("Job #{} → PENDING_AWARD ({} bids)", job.getId(), bids.size());
        }
    }

    private void expireUnawarded(LocalDateTime now) {
        List<Job> jobs = jobRepository.findByStatusAndAuctionClosesAtBefore(
                JobStatus.PENDING_AWARD, now.minusHours(gracePeriodHours));
        for (Job job : jobs) {
            job.setStatus(JobStatus.EXPIRED);
            List<Bid> bids = bidRepository.findByJobIdOrderByAmountAsc(job.getId());
            for (Bid bid : bids) {
                String msg = String.format(
                        "Job #%d has expired without a winner being selected. Your bid has been released.", job.getId());
                notificationService.create(bid.getBidder(), NotificationType.JOB_EXPIRED, msg, job.getId());
                emailService.send(bid.getBidder().getEmail(),
                        "ShipBidder: Job #" + job.getId() + " expired without a winner", msg);
            }
            log.info("Job #{} → EXPIRED (no winner selected)", job.getId());
        }
    }
}

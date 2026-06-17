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

    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void processAuctions() {
        LocalDateTime now = LocalDateTime.now();
        closeExpiredAuctions(now);
        sendPendingAwardReminders(now);
        expireUnawarded(now);
    }

    private void closeExpiredAuctions(LocalDateTime now) {
        List<Job> jobs = jobRepository.findByStatusAndAuctionClosesAtBefore(JobStatus.OPEN, now);
        for (Job job : jobs) {
            List<Bid> bids = bidRepository.findByJobIdOrderByAmountAsc(job.getId());

            if (bids.isEmpty()) {
                job.setStatus(JobStatus.EXPIRED);
                String msg = String.format(
                        "Your auction for Job #%d closed with no bids received.", job.getId());
                notificationService.create(job.getPoster(), NotificationType.AUCTION_CLOSED_NO_BIDS, msg, job.getId());
                emailService.send(job.getPoster().getEmail(),
                        "ShipBidder: No bids for Job #" + job.getId(), msg);
                log.info("Job #{} → EXPIRED (zero bids)", job.getId());
            } else {
                job.setStatus(JobStatus.PENDING_AWARD);
                int bidCount = bids.size();
                String posterMsg = String.format(
                        "Your auction for Job #%d has closed with %d bid%s. Review bids and select a winner.",
                        job.getId(), bidCount, bidCount == 1 ? "" : "s");
                notificationService.create(job.getPoster(), NotificationType.AUCTION_CLOSED, posterMsg, job.getId());
                emailService.send(job.getPoster().getEmail(),
                        "ShipBidder: Auction closed for Job #" + job.getId(), posterMsg);

                for (Bid bid : bids) {
                    String bidderMsg = String.format(
                            "The auction for Job #%d has closed. The job poster is now selecting a winner.",
                            job.getId());
                    notificationService.create(bid.getBidder(), NotificationType.AUCTION_CLOSED, bidderMsg, job.getId());
                    emailService.send(bid.getBidder().getEmail(),
                            "ShipBidder: Auction closed for Job #" + job.getId(), bidderMsg);
                }
                log.info("Job #{} → PENDING_AWARD ({} bids)", job.getId(), bidCount);
            }
        }
    }

    private void sendPendingAwardReminders(LocalDateTime now) {
        LocalDateTime reminderCutoff = now.minusHours(gracePeriodHours / 2);
        List<Job> jobs = jobRepository.findByStatusAndReminderSentFalseAndAuctionClosesAtBefore(
                JobStatus.PENDING_AWARD, reminderCutoff);
        for (Job job : jobs) {
            int hoursLeft = gracePeriodHours / 2;
            String msg = String.format(
                    "Reminder: Job #%d still needs a winner. You have approximately %d hour%s left before it expires.",
                    job.getId(), hoursLeft, hoursLeft == 1 ? "" : "s");
            notificationService.create(job.getPoster(), NotificationType.AUCTION_CLOSE_REMINDER, msg, job.getId());
            emailService.send(job.getPoster().getEmail(),
                    "ShipBidder: Reminder — Job #" + job.getId() + " awaiting award", msg);
            job.setReminderSent(true);
            log.info("Job #{} → reminder sent to poster", job.getId());
        }
    }

    private void expireUnawarded(LocalDateTime now) {
        List<Job> jobs = jobRepository.findByStatusAndAuctionClosesAtBefore(
                JobStatus.PENDING_AWARD, now.minusHours(gracePeriodHours));
        for (Job job : jobs) {
            job.setStatus(JobStatus.EXPIRED);
            List<Bid> bids = bidRepository.findByJobIdOrderByAmountAsc(job.getId());
            String posterMsg = String.format(
                    "Job #%d has expired without a winner being selected.", job.getId());
            notificationService.create(job.getPoster(), NotificationType.JOB_EXPIRED, posterMsg, job.getId());
            emailService.send(job.getPoster().getEmail(),
                    "ShipBidder: Job #" + job.getId() + " has expired", posterMsg);
            for (Bid bid : bids) {
                String bidderMsg = String.format(
                        "Job #%d has expired without a winner being selected. Your bid has been released.",
                        job.getId());
                notificationService.create(bid.getBidder(), NotificationType.JOB_EXPIRED, bidderMsg, job.getId());
                emailService.send(bid.getBidder().getEmail(),
                        "ShipBidder: Job #" + job.getId() + " expired without a winner", bidderMsg);
            }
            log.info("Job #{} → EXPIRED (grace period elapsed)", job.getId());
        }
    }
}

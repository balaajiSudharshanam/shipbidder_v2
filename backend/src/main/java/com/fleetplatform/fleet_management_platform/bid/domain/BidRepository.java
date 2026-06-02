package com.fleetplatform.fleet_management_platform.bid.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    @Query("SELECT b FROM Bid b JOIN FETCH b.bidder WHERE b.job.id = :jobId ORDER BY b.amount ASC")
    List<Bid> findByJobIdOrderByAmountAsc(@Param("jobId") Long jobId);

    Optional<Bid> findByJobIdAndBidderEmail(Long jobId, String bidderEmail);
}

package com.fleetplatform.fleet_management_platform.bid.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    @Query("SELECT b FROM Bid b JOIN FETCH b.bidder WHERE b.job.id = :jobId ORDER BY b.amount ASC")
    List<Bid> findByJobIdOrderByAmountAsc(@Param("jobId") Long jobId);

    @Query("SELECT b FROM Bid b JOIN FETCH b.job WHERE b.bidder.email = :email ORDER BY b.createdAt DESC")
    List<Bid> findByBidderEmailOrderByCreatedAtDesc(@Param("email") String email);

    @Query("SELECT b FROM Bid b WHERE b.job.id = :jobId AND b.bidder.email = :email")
    Optional<Bid> findByJobIdAndBidderEmail(@Param("jobId") Long jobId, @Param("email") String email);
}

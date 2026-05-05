package com.fleetplatform.fleet_management_platform.job.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j JOIN FETCH j.poster JOIN FETCH j.shipment WHERE j.status = :status")
    List<Job> findOpenJobs(JobStatus status);

    @Query("SELECT j FROM Job j JOIN FETCH j.poster JOIN FETCH j.shipment WHERE j.poster.email = :email")
    List<Job> findByPosterEmail(String email);
}

package com.fleetplatform.fleet_management_platform.job.application;

import com.fleetplatform.fleet_management_platform.common.exception.NotFoundException;
import com.fleetplatform.fleet_management_platform.common.exception.UnauthorizedException;
import com.fleetplatform.fleet_management_platform.job.api.CreateJobRequest;
import com.fleetplatform.fleet_management_platform.job.api.JobResponse;
import com.fleetplatform.fleet_management_platform.job.domain.*;
import com.fleetplatform.fleet_management_platform.job.mapper.JobMapper;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public JobResponse createJob(String posterEmail, CreateJobRequest req) {
        User poster = userRepository.findByEmail(posterEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Shipment shipment = Shipment.builder()
                .weightKg(req.getShipment().getWeightKg())
                .lengthCm(req.getShipment().getLengthCm())
                .widthCm(req.getShipment().getWidthCm())
                .heightCm(req.getShipment().getHeightCm())
                .cargoType(req.getShipment().getCargoType())
                .fragile(req.getShipment().getFragile())
                .stackable(req.getShipment().getStackable())
                .specialInstructions(req.getShipment().getSpecialInstructions())
                .build();

        Job job = Job.builder()
                .poster(poster)
                .status(JobStatus.OPEN)
                .budgetCeiling(req.getBudgetCeiling())
                .auctionClosesAt(req.getAuctionClosesAt())
                .pickup(new Location(
                        req.getPickup().getAddress(),
                        req.getPickup().getCity(),
                        req.getPickup().getLat(),
                        req.getPickup().getLng()
                ))
                .dropoff(new Location(
                        req.getDropoff().getAddress(),
                        req.getDropoff().getCity(),
                        req.getDropoff().getLat(),
                        req.getDropoff().getLng()
                ))
                .shipment(shipment)
                .createdAt(LocalDateTime.now())
                .build();

        return JobMapper.toResponse(jobRepository.save(job));
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getOpenJobs() {
        return jobRepository.findOpenJobs(JobStatus.OPEN)
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs(String posterEmail) {
        return jobRepository.findByPosterEmail(posterEmail)
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job not found"));
        return JobMapper.toResponse(job);
    }
}

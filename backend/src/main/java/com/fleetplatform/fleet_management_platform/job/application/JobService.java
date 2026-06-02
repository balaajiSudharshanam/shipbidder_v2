package com.fleetplatform.fleet_management_platform.job.application;

import com.fleetplatform.fleet_management_platform.common.exception.NotFoundException;
import com.fleetplatform.fleet_management_platform.common.exception.UnauthorizedException;
import com.fleetplatform.fleet_management_platform.job.api.CreateJobRequest;
import com.fleetplatform.fleet_management_platform.job.api.JobResponse;
import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.job.domain.JobRepository;
import com.fleetplatform.fleet_management_platform.job.domain.JobStatus;
import com.fleetplatform.fleet_management_platform.job.mapper.JobMapper;
import com.fleetplatform.fleet_management_platform.location.domain.Location;
import com.fleetplatform.fleet_management_platform.location.domain.LocationRepository;
import com.fleetplatform.fleet_management_platform.shipment.domain.Shipment;
import com.fleetplatform.fleet_management_platform.upload.application.UploadService;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final UploadService uploadService;

    @Transactional
    public JobResponse createJob(String posterEmail, CreateJobRequest req) {
        User poster = userRepository.findByEmail(posterEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Location pickup = locationRepository.findById(req.getPickupId())
                .orElseThrow(() -> new NotFoundException("Pickup location not found"));
        Location dropoff = locationRepository.findById(req.getDropoffId())
                .orElseThrow(() -> new NotFoundException("Dropoff location not found"));

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
                .pickup(pickup)
                .dropoff(dropoff)
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

    @Transactional
    public JobResponse attachImages(Long jobId, String posterEmail, List<MultipartFile> files) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getPoster().getEmail().equals(posterEmail)) {
            throw new UnauthorizedException("Not authorised to modify this job");
        }

        List<String> urls = uploadService.uploadImages(files);
        job.getShipment().getImageUrls().addAll(urls);

        return JobMapper.toResponse(jobRepository.save(job));
    }
}

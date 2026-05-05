package com.fleetplatform.fleet_management_platform.job.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.job.application.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(ApiRoutes.Job.BASE)
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('JOB_POSTER')")
    public JobResponse createJob(@Valid @RequestBody CreateJobRequest request, Principal principal) {
        return jobService.createJob(principal.getName(), request);
    }

    @GetMapping
    public List<JobResponse> getOpenJobs() {
        return jobService.getOpenJobs();
    }

    @GetMapping(ApiRoutes.Job.MY)
    @PreAuthorize("hasRole('JOB_POSTER')")
    public List<JobResponse> getMyJobs(Principal principal) {
        return jobService.getMyJobs(principal.getName());
    }

    @GetMapping(ApiRoutes.Job.BY_ID)
    public JobResponse getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }
}

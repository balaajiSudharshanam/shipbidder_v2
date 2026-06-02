package com.fleetplatform.fleet_management_platform.bid.api;

import com.fleetplatform.fleet_management_platform.bid.application.BidService;
import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.Job.BASE)
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping(ApiRoutes.Job.BY_ID_BIDS)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('BIDDER')")
    public BidResponse placeBid(
            @PathVariable Long id,
            @RequestBody BidRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return bidService.placeBid(id, userDetails.getUsername(), req);
    }

    @GetMapping(ApiRoutes.Job.BY_ID_BIDS)
    @PreAuthorize("hasRole('JOB_POSTER')")
    public List<BidResponse> getBids(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return bidService.getBidsForJob(id, userDetails.getUsername());
    }
}

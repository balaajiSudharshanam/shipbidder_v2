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

    @PostMapping(ApiRoutes.Job.BIDS)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('BIDDER')")
    public BidResponse placeBid(@RequestBody BidRequest req) {
        return bidService.placeBid(req);
    }

    @GetMapping(ApiRoutes.Job.BIDS_MY)
    @PreAuthorize("hasRole('BIDDER')")
    public List<BidResponse> getMyBids(@AuthenticationPrincipal UserDetails userDetails) {
        return bidService.getMyBids(userDetails.getUsername());
    }

    @GetMapping(ApiRoutes.Job.BY_ID_BIDS)
    @PreAuthorize("hasRole('JOB_POSTER')")
    public List<BidResponse> getBids(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return bidService.getBidsForJob(id, userDetails.getUsername());
    }

    @PostMapping(ApiRoutes.Job.BY_ID_AWARD)
    @PreAuthorize("hasRole('JOB_POSTER')")
    public BidResponse awardBid(
            @PathVariable Long id,
            @RequestBody AwardRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return bidService.awardBid(id, req.getBidId(), userDetails.getUsername());
    }
}

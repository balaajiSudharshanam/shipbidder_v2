package com.fleetplatform.fleet_management_platform.bid.mapper;

import com.fleetplatform.fleet_management_platform.bid.api.BidResponse;
import com.fleetplatform.fleet_management_platform.bid.domain.Bid;

public class BidMapper {

    private BidMapper() {}

    public static BidResponse toResponse(Bid bid) {
        return new BidResponse(
                bid.getId(),
                bid.getJob().getId(),
                bid.getBidder().getId(),
                bid.getBidder().getName(),
                bid.getBidder().getEmail(),
                bid.getAmount(),
                bid.getStatus(),
                bid.getCreatedAt()
        );
    }
}

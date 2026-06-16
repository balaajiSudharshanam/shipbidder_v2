package com.fleetplatform.fleet_management_platform.bid.mapper;

import com.fleetplatform.fleet_management_platform.bid.api.BidConditionResponse;
import com.fleetplatform.fleet_management_platform.bid.api.BidResponse;
import com.fleetplatform.fleet_management_platform.bid.domain.Bid;
import com.fleetplatform.fleet_management_platform.bid.domain.BidCondition;

public class BidMapper {

    private BidMapper() {}

    public static BidResponse toResponse(Bid bid) {
        BidConditionResponse condition = null;
        BidCondition c = bid.getCondition();
        if (c != null && c.hasAny()) {
            condition = new BidConditionResponse(c.getSharedLoad(), c.getAlternateDeliveryDate(), c.getConditionNote());
        }
        return new BidResponse(
                bid.getId(),
                bid.getJob().getId(),
                bid.getBidder().getId(),
                bid.getBidder().getName(),
                bid.getBidder().getEmail(),
                bid.getAmount(),
                bid.getStatus(),
                bid.getCreatedAt(),
                condition
        );
    }
}

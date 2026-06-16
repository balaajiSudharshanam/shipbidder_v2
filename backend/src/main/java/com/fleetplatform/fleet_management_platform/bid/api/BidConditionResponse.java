package com.fleetplatform.fleet_management_platform.bid.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class BidConditionResponse {
    private Boolean sharedLoad;
    private LocalDate alternateDeliveryDate;
    private String conditionNote;
}

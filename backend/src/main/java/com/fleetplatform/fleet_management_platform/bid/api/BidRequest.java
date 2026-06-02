package com.fleetplatform.fleet_management_platform.bid.api;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class BidRequest {
    private BigDecimal amount;
}

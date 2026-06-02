package com.fleetplatform.fleet_management_platform.bid.api;

import com.fleetplatform.fleet_management_platform.bid.domain.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BidResponse {
    private Long id;
    private Long bidderId;
    private String bidderName;
    private String bidderEmail;
    private BigDecimal amount;
    private BidStatus status;
    private LocalDateTime createdAt;
}

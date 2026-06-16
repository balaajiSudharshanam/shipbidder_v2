package com.fleetplatform.fleet_management_platform.bid.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class BidRequest {
    @NotNull
    private Long jobId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    private Boolean sharedLoad;

    @FutureOrPresent
    private LocalDate alternateDeliveryDate;

    @Size(max = 500)
    private String conditionNote;
}

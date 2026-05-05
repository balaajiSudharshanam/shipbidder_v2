package com.fleetplatform.fleet_management_platform.job.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class CreateJobRequest {

    @Valid
    @NotNull
    private LocationRequest pickup;

    @Valid
    @NotNull
    private LocationRequest dropoff;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal budgetCeiling;

    @NotNull
    @Future
    private LocalDateTime auctionClosesAt;

    @Valid
    @NotNull
    private ShipmentRequest shipment;
}

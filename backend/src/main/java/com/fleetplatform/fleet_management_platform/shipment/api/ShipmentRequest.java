package com.fleetplatform.fleet_management_platform.shipment.api;

import com.fleetplatform.fleet_management_platform.shipment.domain.CargoType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ShipmentRequest {

    @NotNull
    @DecimalMin("0.01")
    private Double weightKg;

    private Double lengthCm;
    private Double widthCm;
    private Double heightCm;

    @NotNull
    private CargoType cargoType;

    private Boolean fragile;
    private Boolean stackable;
    private String specialInstructions;
}

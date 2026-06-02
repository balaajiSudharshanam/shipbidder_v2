package com.fleetplatform.fleet_management_platform.shipment.api;

import com.fleetplatform.fleet_management_platform.shipment.domain.CargoType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ShipmentResponse {
    private Long id;
    private Double weightKg;
    private Double lengthCm;
    private Double widthCm;
    private Double heightCm;
    private CargoType cargoType;
    private Boolean fragile;
    private Boolean stackable;
    private String specialInstructions;
    private List<String> imageUrls;
}

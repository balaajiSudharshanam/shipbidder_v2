package com.fleetplatform.fleet_management_platform.shipment.mapper;

import com.fleetplatform.fleet_management_platform.shipment.api.ShipmentResponse;
import com.fleetplatform.fleet_management_platform.shipment.domain.Shipment;

import java.util.List;

public class ShipmentMapper {

    private ShipmentMapper() {}

    public static ShipmentResponse toResponse(Shipment shipment) {
        return new ShipmentResponse(
                shipment.getId(),
                shipment.getWeightKg(),
                shipment.getLengthCm(),
                shipment.getWidthCm(),
                shipment.getHeightCm(),
                shipment.getCargoType(),
                shipment.getFragile(),
                shipment.getStackable(),
                shipment.getSpecialInstructions(),
                List.copyOf(shipment.getImageUrls())
        );
    }
}

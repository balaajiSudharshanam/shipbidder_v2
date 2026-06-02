package com.fleetplatform.fleet_management_platform.shipment.application;

import com.fleetplatform.fleet_management_platform.common.exception.NotFoundException;
import com.fleetplatform.fleet_management_platform.shipment.api.ShipmentResponse;
import com.fleetplatform.fleet_management_platform.shipment.domain.ShipmentRepository;
import com.fleetplatform.fleet_management_platform.shipment.mapper.ShipmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    @Transactional(readOnly = true)
    public ShipmentResponse getById(Long id) {
        return shipmentRepository.findById(id)
                .map(ShipmentMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Shipment not found"));
    }
}

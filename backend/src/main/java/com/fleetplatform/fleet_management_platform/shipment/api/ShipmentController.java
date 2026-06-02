
package com.fleetplatform.fleet_management_platform.shipment.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.shipment.application.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.Shipment.BASE)
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping(ApiRoutes.Shipment.BY_ID)
    public ShipmentResponse getById(@PathVariable Long id) {
        return shipmentService.getById(id);
    }
}

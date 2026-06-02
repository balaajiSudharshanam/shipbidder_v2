package com.fleetplatform.fleet_management_platform.shipment.api;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.shipment.domain.CargoType;
import com.fleetplatform.fleet_management_platform.shipment.domain.Shipment;
import com.fleetplatform.fleet_management_platform.shipment.domain.ShipmentRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
class ShipmentControllerTest {

    private static final String SHIPMENTS_URL = ApiRoutes.Shipment.BASE;

    @Autowired private WebApplicationContext context;
    @Autowired private ShipmentRepository shipmentRepository;

    private MockMvc mockMvc;
    private Long shipmentId;
    private Long fullShipmentId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(SecurityMockMvcConfigurers.springSecurity())
            .build();
        shipmentRepository.deleteAll();

        shipmentId = shipmentRepository.save(Shipment.builder()
            .weightKg(100.0)
            .cargoType(CargoType.GENERAL)
            .fragile(false)
            .stackable(true)
            .build()).getId();

        fullShipmentId = shipmentRepository.save(Shipment.builder()
            .weightKg(250.5)
            .lengthCm(120.0)
            .widthCm(80.0)
            .heightCm(60.0)
            .cargoType(CargoType.REFRIGERATED)
            .fragile(true)
            .stackable(false)
            .specialInstructions("Keep below 4°C at all times")
            .build()).getId();
    }

    @AfterEach
    void tearDown() {
        shipmentRepository.deleteAll();
    }

    // ===== GET /api/shipments/{id} — happy path =====

    @Test
    @WithMockUser(username = "user@test.com")
    void getShipment_minimalFields_returns200WithRequiredFields() throws Exception {
        mockMvc.perform(get(SHIPMENTS_URL + "/" + shipmentId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(shipmentId))
            .andExpect(jsonPath("$.weightKg").value(100.0))
            .andExpect(jsonPath("$.cargoType").value("GENERAL"))
            .andExpect(jsonPath("$.fragile").value(false))
            .andExpect(jsonPath("$.stackable").value(true));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getShipment_allFields_returns200WithFullResponse() throws Exception {
        mockMvc.perform(get(SHIPMENTS_URL + "/" + fullShipmentId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(fullShipmentId))
            .andExpect(jsonPath("$.weightKg").value(250.5))
            .andExpect(jsonPath("$.lengthCm").value(120.0))
            .andExpect(jsonPath("$.widthCm").value(80.0))
            .andExpect(jsonPath("$.heightCm").value(60.0))
            .andExpect(jsonPath("$.cargoType").value("REFRIGERATED"))
            .andExpect(jsonPath("$.fragile").value(true))
            .andExpect(jsonPath("$.stackable").value(false))
            .andExpect(jsonPath("$.specialInstructions").value("Keep below 4°C at all times"));
    }

    // ===== GET /api/shipments/{id} — error cases =====

    @Test
    @WithMockUser(username = "user@test.com")
    void getShipment_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get(SHIPMENTS_URL + "/999999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getShipment_invalidIdType_returns400() throws Exception {
        mockMvc.perform(get(SHIPMENTS_URL + "/not-a-number"))
            .andExpect(status().isBadRequest());
    }

    // ===== GET /api/shipments/{id} — authorization =====

    @Test
    void getShipment_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(get(SHIPMENTS_URL + "/" + shipmentId))
            .andExpect(status().is3xxRedirection());
    }
}

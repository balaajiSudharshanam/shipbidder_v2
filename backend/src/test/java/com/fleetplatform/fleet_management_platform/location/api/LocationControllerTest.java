package com.fleetplatform.fleet_management_platform.location.api;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.location.domain.LocationRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
class LocationControllerTest {

    private static final String LOCATIONS_URL = ApiRoutes.Location.BASE;

    @Autowired private WebApplicationContext context;
    @Autowired private LocationRepository locationRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(SecurityMockMvcConfigurers.springSecurity())
            .build();
        locationRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        locationRepository.deleteAll();
    }

    private Map<String, Object> coordsOnly() {
        Map<String, Object> body = new HashMap<>();
        body.put("lat", 13.0827);
        body.put("lng", 80.2707);
        return body;
    }

    private Map<String, Object> coordsWithAddress() {
        Map<String, Object> body = coordsOnly();
        body.put("address", "Ripon Buildings, Chennai, Tamil Nadu, India");
        return body;
    }

    private String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    // ===== POST /api/locations — happy path =====

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_coordsOnly_returns201WithIdAndCoords() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsOnly())))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.lat").value(13.0827))
            .andExpect(jsonPath("$.lng").value(80.2707))
            .andExpect(jsonPath("$.address").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_withAddress_returns201AndStoresAddress() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsWithAddress())))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.lat").value(13.0827))
            .andExpect(jsonPath("$.lng").value(80.2707))
            .andExpect(jsonPath("$.address").value("Ripon Buildings, Chennai, Tamil Nadu, India"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_duplicateCoords_createsSeparateRows() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsOnly())))
            .andExpect(status().isCreated());

        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsOnly())))
            .andExpect(status().isCreated());

        mockMvc.perform(get(LOCATIONS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
    }

    // ===== POST /api/locations — validation =====

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_nullLat_returns400() throws Exception {
        Map<String, Object> body = coordsOnly();
        body.put("lat", null);
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.lat").exists());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_nullLng_returns400() throws Exception {
        Map<String, Object> body = coordsOnly();
        body.put("lng", null);
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.lng").exists());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void saveLocation_missingBothCoords_returns400() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.lat").exists())
            .andExpect(jsonPath("$.errors.lng").exists());
    }

    // ===== POST /api/locations — authorization =====

    @Test
    void saveLocation_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsOnly())))
            .andExpect(status().is3xxRedirection());
    }

    // ===== GET /api/locations — happy path =====

    @Test
    @WithMockUser(username = "user@test.com")
    void getLocations_emptyDb_returnsEmptyList() throws Exception {
        mockMvc.perform(get(LOCATIONS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getLocations_afterSave_returnsAllSaved() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsOnly())))
            .andExpect(status().isCreated());

        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsWithAddress())))
            .andExpect(status().isCreated());

        mockMvc.perform(get(LOCATIONS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].id").isNumber())
            .andExpect(jsonPath("$[0].lat").isNumber())
            .andExpect(jsonPath("$[0].lng").isNumber());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getLocations_addressIsPreserved() throws Exception {
        mockMvc.perform(post(LOCATIONS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(coordsWithAddress())))
            .andExpect(status().isCreated());

        mockMvc.perform(get(LOCATIONS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].address").value("Ripon Buildings, Chennai, Tamil Nadu, India"));
    }

    // ===== GET /api/locations — authorization =====

    @Test
    void getLocations_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(get(LOCATIONS_URL))
            .andExpect(status().is3xxRedirection());
    }
}

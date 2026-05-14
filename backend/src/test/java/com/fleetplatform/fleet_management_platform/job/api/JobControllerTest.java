package com.fleetplatform.fleet_management_platform.job.api;

import java.time.LocalDateTime;
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
import com.fleetplatform.fleet_management_platform.job.domain.JobRepository;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
class JobControllerTest {

    private static final String POSTER_EMAIL = "poster@test.com";
    private static final String JOBS_URL = ApiRoutes.Job.BASE;
    private static final String MY_JOBS_URL = ApiRoutes.Job.BASE + ApiRoutes.Job.MY;

    @Autowired private WebApplicationContext context;
    @Autowired private UserRepository userRepository;
    @Autowired private JobRepository jobRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(SecurityMockMvcConfigurers.springSecurity())
            .build();
        jobRepository.deleteAll();
        userRepository.deleteAll();
        userRepository.save(User.builder()
            .email(POSTER_EMAIL)
            .name("Test Poster")
            .provider("local")
            .role(UserRole.JOB_POSTER)
            .createdAt(LocalDateTime.now())
            .build());
    }

    @AfterEach
    void tearDown() {
        jobRepository.deleteAll();
        userRepository.deleteAll();
    }

    private Map<String, Object> validBody() {
        Map<String, Object> pickup = Map.of(
            "address", "123 Pickup St",
            "city", "Chennai",
            "lat", 13.0827,
            "lng", 80.2707
        );
        Map<String, Object> dropoff = Map.of(
            "address", "456 Dropoff Ave",
            "city", "Bangalore",
            "lat", 12.9716,
            "lng", 77.5946
        );
        Map<String, Object> shipment = Map.of(
            "weightKg", 100.0,
            "cargoType", "GENERAL",
            "fragile", false,
            "stackable", true
        );
        Map<String, Object> body = new HashMap<>();
        body.put("pickup", pickup);
        body.put("dropoff", dropoff);
        body.put("budgetCeiling", 1000.00);
        body.put("auctionClosesAt", "2027-06-01T10:00:00");
        body.put("shipment", shipment);
        return body;
    }

    private Map<String, Object> locationMap(String address, String city, Double lat, Double lng) {
        Map<String, Object> loc = new HashMap<>();
        loc.put("address", address);
        loc.put("city", city);
        loc.put("lat", lat);
        loc.put("lng", lng);
        return loc;
    }

    private Map<String, Object> shipmentMap(Double weightKg, String cargoType) {
        Map<String, Object> s = new HashMap<>();
        s.put("weightKg", weightKg);
        s.put("cargoType", cargoType);
        return s;
    }

    private String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    // ===== POST /api/jobs — happy path =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_validRequest_returns201WithFullResponse() throws Exception {
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.posterEmail").value(POSTER_EMAIL))
            .andExpect(jsonPath("$.status").value("OPEN"))
            .andExpect(jsonPath("$.budgetCeiling").value(1000.0))
            .andExpect(jsonPath("$.pickup.address").value("123 Pickup St"))
            .andExpect(jsonPath("$.pickup.city").value("Chennai"))
            .andExpect(jsonPath("$.pickup.lat").value(13.0827))
            .andExpect(jsonPath("$.dropoff.address").value("456 Dropoff Ave"))
            .andExpect(jsonPath("$.dropoff.city").value("Bangalore"))
            .andExpect(jsonPath("$.shipment.weightKg").value(100.0))
            .andExpect(jsonPath("$.shipment.cargoType").value("GENERAL"))
            .andExpect(jsonPath("$.shipment.fragile").value(false));
    }

    // ===== POST /api/jobs — authorization =====

    @Test
    void createJob_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().is3xxRedirection());
    }

    @Test
    @WithMockUser(username = "bidder@test.com", roles = "BIDDER")
    void createJob_asBidder_returns403() throws Exception {
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().isForbidden());
    }

    // ===== POST /api/jobs — pickup location validation =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullPickup_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("pickup", null);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.pickup").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_blankPickupAddress_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("pickup", locationMap("", "Chennai", 13.08, 80.27));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['pickup.address']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_whitespacePickupCity_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("pickup", locationMap("123 Pickup St", "   ", 13.08, 80.27));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['pickup.city']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullPickupLat_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("pickup", locationMap("123 Pickup St", "Chennai", null, 80.27));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['pickup.lat']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullPickupLng_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("pickup", locationMap("123 Pickup St", "Chennai", 13.08, null));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['pickup.lng']").exists());
    }

    // ===== POST /api/jobs — dropoff location validation =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullDropoff_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("dropoff", null);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.dropoff").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_blankDropoffAddress_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("dropoff", locationMap("", "Bangalore", 12.97, 77.59));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['dropoff.address']").exists());
    }

    // ===== POST /api/jobs — budget validation =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullBudgetCeiling_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("budgetCeiling", null);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.budgetCeiling").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_zeroBudgetCeiling_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("budgetCeiling", 0.00);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.budgetCeiling").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_negativeBudgetCeiling_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("budgetCeiling", -500.00);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.budgetCeiling").exists());
    }

    // ===== POST /api/jobs — auction time validation =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullAuctionClosesAt_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("auctionClosesAt", null);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.auctionClosesAt").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_pastAuctionClosesAt_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("auctionClosesAt", "2020-01-01T10:00:00");
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.auctionClosesAt").exists());
    }

    // ===== POST /api/jobs — shipment validation =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullShipment_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("shipment", null);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.shipment").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullWeightKg_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("shipment", shipmentMap(null, "GENERAL"));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['shipment.weightKg']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_zeroWeightKg_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("shipment", shipmentMap(0.0, "GENERAL"));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['shipment.weightKg']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_negativeWeightKg_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("shipment", shipmentMap(-10.0, "GENERAL"));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['shipment.weightKg']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_nullCargoType_returns400() throws Exception {
        Map<String, Object> body = validBody();
        body.put("shipment", shipmentMap(100.0, null));
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors['shipment.cargoType']").exists());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_invalidCargoType_returns400() throws Exception {
        String rawJson = """
            {
              "pickup":  {"address":"123 Pickup St","city":"Chennai","lat":13.08,"lng":80.27},
              "dropoff": {"address":"456 Dropoff Ave","city":"Bangalore","lat":12.97,"lng":77.59},
              "budgetCeiling": 1000.00,
              "auctionClosesAt": "2027-06-01T10:00:00",
              "shipment": {"weightKg":100.0,"cargoType":"INVALID_CARGO"}
            }
            """;
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(rawJson))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void createJob_withOptionalShipmentFields_returns201() throws Exception {
        Map<String, Object> shipment = new HashMap<>();
        shipment.put("weightKg", 250.5);
        shipment.put("lengthCm", 120.0);
        shipment.put("widthCm", 80.0);
        shipment.put("heightCm", 60.0);
        shipment.put("cargoType", "REFRIGERATED");
        shipment.put("fragile", true);
        shipment.put("stackable", false);
        shipment.put("specialInstructions", "Keep below 4°C at all times");
        Map<String, Object> body = validBody();
        body.put("shipment", shipment);
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.shipment.weightKg").value(250.5))
            .andExpect(jsonPath("$.shipment.cargoType").value("REFRIGERATED"))
            .andExpect(jsonPath("$.shipment.fragile").value(true))
            .andExpect(jsonPath("$.shipment.specialInstructions").value("Keep below 4°C at all times"));
    }

    // ===== GET /api/jobs =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void getOpenJobs_noExistingJobs_returnsEmptyList() throws Exception {
        mockMvc.perform(get(JOBS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void getOpenJobs_afterCreation_returnsJobInList() throws Exception {
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().isCreated());

        mockMvc.perform(get(JOBS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].status").value("OPEN"))
            .andExpect(jsonPath("$[0].pickup.address").value("123 Pickup St"))
            .andExpect(jsonPath("$[0].dropoff.address").value("456 Dropoff Ave"))
            .andExpect(jsonPath("$[0].shipment.cargoType").value("GENERAL"));
    }

    @Test
    void getOpenJobs_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(get(JOBS_URL))
            .andExpect(status().is3xxRedirection());
    }

    // ===== GET /api/jobs/my =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void getMyJobs_asJobPoster_returns200WithList() throws Exception {
        mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().isCreated());

        mockMvc.perform(get(MY_JOBS_URL))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].posterEmail").value(POSTER_EMAIL));
    }

    @Test
    @WithMockUser(username = "bidder@test.com", roles = "BIDDER")
    void getMyJobs_asBidder_returns403() throws Exception {
        mockMvc.perform(get(MY_JOBS_URL))
            .andExpect(status().isForbidden());
    }

    @Test
    void getMyJobs_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(get(MY_JOBS_URL))
            .andExpect(status().is3xxRedirection());
    }

    // ===== GET /api/jobs/{id} =====

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void getJobById_existingJob_returns200WithDetails() throws Exception {
        String response = mockMvc.perform(post(JOBS_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(validBody())))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        long jobId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get(JOBS_URL + "/" + jobId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(jobId))
            .andExpect(jsonPath("$.status").value("OPEN"))
            .andExpect(jsonPath("$.pickup.lat").value(13.0827))
            .andExpect(jsonPath("$.dropoff.lng").value(77.5946))
            .andExpect(jsonPath("$.shipment.weightKg").value(100.0));
    }

    @Test
    @WithMockUser(username = POSTER_EMAIL, roles = "JOB_POSTER")
    void getJobById_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get(JOBS_URL + "/999999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void getJobById_unauthenticated_isRejected() throws Exception {
        mockMvc.perform(get(JOBS_URL + "/1"))
            .andExpect(status().is3xxRedirection());
    }
}

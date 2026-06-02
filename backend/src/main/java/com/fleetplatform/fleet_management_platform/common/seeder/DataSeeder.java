package com.fleetplatform.fleet_management_platform.common.seeder;

import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.job.domain.JobRepository;
import com.fleetplatform.fleet_management_platform.job.domain.JobStatus;
import com.fleetplatform.fleet_management_platform.location.domain.Location;
import com.fleetplatform.fleet_management_platform.location.domain.LocationRepository;
import com.fleetplatform.fleet_management_platform.shipment.domain.CargoType;
import com.fleetplatform.fleet_management_platform.shipment.domain.Shipment;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder {

    private static final String EMPLOYER_EMAIL = "employer@test.com";
    private static final String DRIVER_EMAIL   = "driver@test.com";
    private static final String TEST_PASSWORD  = "Test1234!";

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        if (userRepository.findByEmail(EMPLOYER_EMAIL).isPresent()) {
            log.info("Seed data already present — skipping.");
            return;
        }

        User employer = userRepository.save(User.builder()
                .email(EMPLOYER_EMAIL)
                .name("Test Employer")
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .provider("LOCAL")
                .role(UserRole.JOB_POSTER)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .email(DRIVER_EMAIL)
                .name("Test Driver")
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .provider("LOCAL")
                .role(UserRole.BIDDER)
                .createdAt(LocalDateTime.now())
                .build());

        Location pickup = locationRepository.save(Location.builder()
                .lat(40.7128)
                .lng(-74.0060)
                .address("New York, NY")
                .build());

        Location dropoff = locationRepository.save(Location.builder()
                .lat(42.3601)
                .lng(-71.0589)
                .address("Boston, MA")
                .build());

        Shipment shipment = Shipment.builder()
                .weightKg(500.0)
                .lengthCm(200.0)
                .widthCm(120.0)
                .heightCm(100.0)
                .cargoType(CargoType.GENERAL)
                .fragile(false)
                .stackable(true)
                .specialInstructions("Handle with care. Deliver before 5 PM.")
                .build();

        jobRepository.save(Job.builder()
                .poster(employer)
                .status(JobStatus.OPEN)
                .budgetCeiling(new BigDecimal("2500.00"))
                .auctionClosesAt(LocalDateTime.now().plusDays(7))
                .pickup(pickup)
                .dropoff(dropoff)
                .shipment(shipment)
                .createdAt(LocalDateTime.now())
                .build());

        log.info("Seed data created — employer@test.com / driver@test.com (password: Test1234!)");
    }
}

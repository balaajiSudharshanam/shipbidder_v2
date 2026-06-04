package com.fleetplatform.fleet_management_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class FleetManagementPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleetManagementPlatformApplication.class, args);
	}

}

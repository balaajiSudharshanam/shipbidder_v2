package com.fleetplatform.fleet_management_platform.notification.api;

import com.fleetplatform.fleet_management_platform.notification.domain.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String message;
    private Long jobId;
    private boolean read;
    private LocalDateTime createdAt;
}

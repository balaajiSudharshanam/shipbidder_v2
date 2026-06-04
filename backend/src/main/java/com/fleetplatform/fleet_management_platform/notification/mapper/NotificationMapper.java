package com.fleetplatform.fleet_management_platform.notification.mapper;

import com.fleetplatform.fleet_management_platform.notification.api.NotificationResponse;
import com.fleetplatform.fleet_management_platform.notification.domain.Notification;

public class NotificationMapper {

    public static NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getMessage(),
                n.getJobId(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}

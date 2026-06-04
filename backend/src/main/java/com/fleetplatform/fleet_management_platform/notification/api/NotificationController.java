package com.fleetplatform.fleet_management_platform.notification.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.notification.application.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.Notification.BASE)
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        return notificationService.getMyNotifications(userDetails.getUsername());
    }

    @GetMapping(ApiRoutes.Notification.UNREAD_COUNT)
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return Map.of("count", notificationService.getUnreadCount(userDetails.getUsername()));
    }

    @PatchMapping(ApiRoutes.Notification.BY_ID_READ)
    public void markRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markRead(id, userDetails.getUsername());
    }

    @PostMapping(ApiRoutes.Notification.READ_ALL)
    public void markAllRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllRead(userDetails.getUsername());
    }
}

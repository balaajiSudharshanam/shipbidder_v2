package com.fleetplatform.fleet_management_platform.notification.application;

import com.fleetplatform.fleet_management_platform.common.exception.ForbiddenException;
import com.fleetplatform.fleet_management_platform.common.exception.NotFoundException;
import com.fleetplatform.fleet_management_platform.notification.api.NotificationResponse;
import com.fleetplatform.fleet_management_platform.notification.domain.Notification;
import com.fleetplatform.fleet_management_platform.notification.domain.NotificationRepository;
import com.fleetplatform.fleet_management_platform.notification.domain.NotificationType;
import com.fleetplatform.fleet_management_platform.notification.mapper.NotificationMapper;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void create(User recipient, NotificationType type, String message, Long jobId) {
        notificationRepository.save(
                Notification.builder()
                        .recipient(recipient)
                        .type(type)
                        .message(message)
                        .jobId(jobId)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndReadFalse(email);
    }

    @Transactional
    public void markRead(Long id, String email) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        if (!n.getRecipient().getEmail().equals(email)) {
            throw new ForbiddenException("Access denied");
        }
        n.setRead(true);
    }

    @Transactional
    public void markAllRead(String email) {
        notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email)
                .forEach(n -> n.setRead(true));
    }
}

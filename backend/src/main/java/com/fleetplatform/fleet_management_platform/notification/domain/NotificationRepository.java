package com.fleetplatform.fleet_management_platform.notification.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.recipient.email = :email ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(@Param("email") String email);

    long countByRecipientEmailAndReadFalse(String email);
}

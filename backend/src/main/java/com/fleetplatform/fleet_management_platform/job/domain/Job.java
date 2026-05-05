package com.fleetplatform.fleet_management_platform.job.domain;

import com.fleetplatform.fleet_management_platform.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_id", nullable = false)
    private User poster;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetCeiling;

    @Column(nullable = false)
    private LocalDateTime auctionClosesAt;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "address", column = @Column(name = "pickup_address", nullable = false)),
            @AttributeOverride(name = "city",    column = @Column(name = "pickup_city",    nullable = false)),
            @AttributeOverride(name = "lat",     column = @Column(name = "pickup_lat",     nullable = false)),
            @AttributeOverride(name = "lng",     column = @Column(name = "pickup_lng",     nullable = false))
    })
    private Location pickup;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "address", column = @Column(name = "dropoff_address", nullable = false)),
            @AttributeOverride(name = "city",    column = @Column(name = "dropoff_city",    nullable = false)),
            @AttributeOverride(name = "lat",     column = @Column(name = "dropoff_lat",     nullable = false)),
            @AttributeOverride(name = "lng",     column = @Column(name = "dropoff_lng",     nullable = false))
    })
    private Location dropoff;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}

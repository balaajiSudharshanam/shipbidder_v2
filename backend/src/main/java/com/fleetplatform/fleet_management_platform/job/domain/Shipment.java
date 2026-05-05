package com.fleetplatform.fleet_management_platform.job.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double weightKg;

    private Double lengthCm;
    private Double widthCm;
    private Double heightCm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CargoType cargoType;

    private Boolean fragile;
    private Boolean stackable;

    @Column(columnDefinition = "TEXT")
    private String specialInstructions;
}

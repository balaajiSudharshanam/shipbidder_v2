package com.fleetplatform.fleet_management_platform.shipment.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shipment_images", joinColumns = @JoinColumn(name = "shipment_id"))
    @Column(name = "url", length = 1000)
    private List<String> imageUrls = new ArrayList<>();
}

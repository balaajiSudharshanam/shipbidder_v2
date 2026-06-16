package com.fleetplatform.fleet_management_platform.bid.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidCondition {

    private Boolean sharedLoad;

    private LocalDate alternateDeliveryDate;

    @Column(length = 500)
    private String conditionNote;

    public boolean hasAny() {
        return Boolean.TRUE.equals(sharedLoad)
                || alternateDeliveryDate != null
                || (conditionNote != null && !conditionNote.isBlank());
    }
}

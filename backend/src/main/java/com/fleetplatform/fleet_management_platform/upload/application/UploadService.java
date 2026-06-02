package com.fleetplatform.fleet_management_platform.upload.application;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final Cloudinary cloudinary;

    public List<String> uploadImages(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            Path temp = null;
            try {
                temp = Files.createTempFile("shipment_", "_" + file.getOriginalFilename());
                file.transferTo(temp.toFile());

                Map<?, ?> result = cloudinary.uploader().upload(
                        temp.toFile(),
                        ObjectUtils.asMap("folder", "shipments")
                );
                urls.add((String) result.get("secure_url"));
            } catch (IOException e) {
                throw new UncheckedIOException("Failed to upload image: " + file.getOriginalFilename(), e);
            } finally {
                if (temp != null) {
                    try { Files.deleteIfExists(temp); } catch (IOException ignored) {}
                }
            }
        }
        return urls;
    }
}

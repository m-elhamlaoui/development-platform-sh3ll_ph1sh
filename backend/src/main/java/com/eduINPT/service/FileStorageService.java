package com.eduINPT.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;
    
    public FileStorageService() {
        // Create uploads directory in the project root
        String userDir = System.getProperty("user.dir");
        this.rootLocation = Paths.get(userDir, "uploads");
        init();
    }

    @PostConstruct
    public void init() {
        try {
            File directory = rootLocation.toFile();
            if (!directory.exists()) {
                Files.createDirectories(rootLocation);
            }
            System.out.println("Storage initialized at: " + rootLocation.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage: " + e.getMessage(), e);
        }
    }

    public String store(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFilename.contains("..")) {
                // Security check for path traversal attacks
                throw new RuntimeException("Cannot store file with relative path outside current directory " + originalFilename);
            }
            
            String fileExtension = "";
            int lastIndexOf = originalFilename.lastIndexOf(".");
            if (lastIndexOf > 0) {
                fileExtension = originalFilename.substring(lastIndexOf);
            }
            
            String storedFilename = UUID.randomUUID().toString() + fileExtension;
            Path destinationFile = this.rootLocation.resolve(storedFilename);
            
            // Ensure directory exists
            Files.createDirectories(destinationFile.getParent());
            
            // Copy file
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("Stored file at: " + destinationFile.toAbsolutePath());
            return storedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }
    
    public String getContentType(String filename) throws IOException {
        Path file = rootLocation.resolve(filename);
        String contentType = Files.probeContentType(file);
        
        // Handle null content type for certain files
        if (contentType == null) {
            String lowerFilename = filename.toLowerCase();
            if (lowerFilename.endsWith(".pdf")) {
                return "application/pdf";
            } else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
                return "image/jpeg";
            } else if (lowerFilename.endsWith(".png")) {
                return "image/png";
            } else if (lowerFilename.endsWith(".txt")) {
                return "text/plain";
            } else {
                return "application/octet-stream";
            }
        }
        
        return contentType;
    }
} 
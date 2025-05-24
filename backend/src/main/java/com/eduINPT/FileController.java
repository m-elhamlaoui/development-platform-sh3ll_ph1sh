package com.eduINPT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.eduINPT.backend.model.Subject;
import com.eduINPT.backend.model.SubjectFile;
import com.eduINPT.backend.repository.SubjectFileRepository;
import com.eduINPT.backend.repository.SubjectRepository;
import com.eduINPT.service.FileStorageService;

import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private SubjectFileRepository subjectFileRepository;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadAsResource(filename);
            String contentType = fileStorageService.getContentType(filename);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/subject/{subjectName}")
    public ResponseEntity<List<SubjectFileDTO>> getFilesBySubject(@PathVariable String subjectName) {
        try {
            List<SubjectFile> files = subjectFileRepository.findBySubjectName(subjectName);
            
            List<SubjectFileDTO> fileDTOs = files.stream()
                .map(file -> new SubjectFileDTO(
                    file.getId(),
                    file.getTitle(),
                    file.getFileName(),
                    file.getFileType(),
                    file.getSize(),
                    file.getStoredFileName()
                ))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(fileDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subjectName") String subjectName,
            @RequestParam("title") String title,
            @RequestParam("fileType") String fileType) {
        
        System.out.println("File upload request received - Subject: " + subjectName + ", Title: " + title);
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            System.out.println("Original filename: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize() + " bytes");
            
            // Find subject
            Optional<Subject> subjectOpt = subjectRepository.findByName(subjectName);
            if (subjectOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Subject not found: " + subjectName);
            }
            Subject subject = subjectOpt.get();
            
            // Store file
            String storedFileName = fileStorageService.store(file);
            System.out.println("File stored as: " + storedFileName);
            
            // Calculate file size
            String size = String.format("%.2f KB", file.getSize() / 1024.0);
            
            // Create file record
            SubjectFile subjectFile = new SubjectFile(
                title,
                file.getOriginalFilename(),
                fileType,
                size,
                storedFileName
            );
            
            subjectFile.setSubject(subject);
            subjectFileRepository.save(subjectFile);
            
            System.out.println("File record saved to database with ID: " + subjectFile.getId());
            
            return ResponseEntity.ok().body("File uploaded successfully: " + storedFileName);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<SubjectFileDTO>> getAllFiles() {
        try {
            List<SubjectFile> files = subjectFileRepository.findAll();
            
            List<SubjectFileDTO> fileDTOs = files.stream()
                .map(file -> new SubjectFileDTO(
                    file.getId(),
                    file.getTitle(),
                    file.getFileName(),
                    file.getFileType(),
                    file.getSize(),
                    file.getStoredFileName()
                ))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(fileDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    // DTO class for file info
    public static class SubjectFileDTO {
        private Long id;
        private String title;
        private String fileName;
        private String fileType;
        private String size;
        private String storedFileName;
        
        public SubjectFileDTO(Long id, String title, String fileName, String fileType, String size, String storedFileName) {
            this.id = id;
            this.title = title;
            this.fileName = fileName;
            this.fileType = fileType;
            this.size = size;
            this.storedFileName = storedFileName;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getFileName() {
            return fileName;
        }

        public String getFileType() {
            return fileType;
        }

        public String getSize() {
            return size;
        }
        
        public String getStoredFileName() {
            return storedFileName;
        }
    }
}
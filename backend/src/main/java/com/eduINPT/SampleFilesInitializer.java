package com.eduINPT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.eduINPT.backend.model.Subject;
import com.eduINPT.backend.model.SubjectFile;
import com.eduINPT.backend.repository.SubjectFileRepository;
import com.eduINPT.backend.repository.SubjectRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
@Order(2) // Run after DataInitializer which is @Order(1)
public class SampleFilesInitializer implements CommandLineRunner {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectFileRepository subjectFileRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if we already have files in the database
        if (subjectFileRepository.count() > 0) {
            System.out.println("Sample files already exist. Skipping initialization.");
            return;
        }
        
        System.out.println("Initializing sample files...");

        // Define sample files for each subject
        Map<String, List<SampleFileInfo>> subjectFiles = new HashMap<>();
        
        subjectFiles.put("Mathematics", Arrays.asList(
            new SampleFileInfo("Algebra Basics", "PDF", "sample-files/math-algebra.pdf"),
            new SampleFileInfo("Calculus Introduction", "PDF", "sample-files/math-calculus.pdf"),
            new SampleFileInfo("Geometry Formulas", "PDF", "sample-files/math-geometry.pdf")
        ));
        
        subjectFiles.put("Physics", Arrays.asList(
            new SampleFileInfo("Mechanics Principles", "PDF", "sample-files/physics-mechanics.pdf"),
            new SampleFileInfo("Electricity Basics", "PDF", "sample-files/physics-electricity.pdf")
        ));
        
        subjectFiles.put("English", Arrays.asList(
            new SampleFileInfo("Grammar Rules", "PDF", "sample-files/english-grammar.pdf"),
            new SampleFileInfo("Essay Writing", "PDF", "sample-files/english-essay.pdf")
        ));
        
        subjectFiles.put("French", Arrays.asList(
            new SampleFileInfo("Basic Vocabulary", "PDF", "sample-files/french-vocabulary.pdf"),
            new SampleFileInfo("French Pronunciation", "Audio", "sample-files/french-pronunciation.mp3")
        ));
        
        subjectFiles.put("Arabic", Arrays.asList(
            new SampleFileInfo("Arabic Script", "PDF", "sample-files/arabic-script.pdf"),
            new SampleFileInfo("Arabic Grammar", "PDF", "sample-files/arabic-grammar.pdf")
        ));
        
        subjectFiles.put("Chemistry", Arrays.asList(
            new SampleFileInfo("Periodic Table", "PDF", "sample-files/chemistry-periodic.pdf"),
            new SampleFileInfo("Organic Chemistry", "PDF", "sample-files/chemistry-organic.pdf")
        ));
        
        subjectFiles.put("History", Arrays.asList(
            new SampleFileInfo("World War II", "PDF", "sample-files/history-ww2.pdf"),
            new SampleFileInfo("Ancient Civilizations", "PDF", "sample-files/history-ancient.pdf")
        ));
        
        subjectFiles.put("Computer Science", Arrays.asList(
            new SampleFileInfo("Java Programming", "PDF", "sample-files/cs-java.pdf"),
            new SampleFileInfo("Web Development", "PDF", "sample-files/cs-web.pdf"),
            new SampleFileInfo("Database Design", "PDF", "sample-files/cs-database.pdf")
        ));

        // Create uploads directory if it doesn't exist
        Path uploadsDir = Paths.get(System.getProperty("user.dir"), "uploads");
        if (!Files.exists(uploadsDir)) {
            Files.createDirectories(uploadsDir);
        }

        // Get sample file content
        Resource defaultFileResource = new ClassPathResource("static/sample-file.pdf");
        byte[] defaultFileContent = null;
        try (InputStream inputStream = defaultFileResource.getInputStream()) {
            defaultFileContent = inputStream.readAllBytes();
        } catch (IOException e) {
            System.err.println("Could not read default file: " + e.getMessage());
            // Create a simple default content
            defaultFileContent = "This is a sample file content.".getBytes();
        }

        // Add sample files for each subject
        for (Map.Entry<String, List<SampleFileInfo>> entry : subjectFiles.entrySet()) {
            String subjectName = entry.getKey();
            List<SampleFileInfo> files = entry.getValue();
            
            Optional<Subject> subjectOpt = subjectRepository.findByName(subjectName);
            if (subjectOpt.isPresent()) {
                Subject subject = subjectOpt.get();
                
                for (SampleFileInfo fileInfo : files) {
                    try {
                        // Generate a unique filename
                        String originalFileName = fileInfo.getFileName();
                        String fileExtension = "";
                        int lastDotIndex = originalFileName.lastIndexOf('.');
                        if (lastDotIndex > 0) {
                            fileExtension = originalFileName.substring(lastDotIndex);
                        }
                        
                        String storedFileName = UUID.randomUUID().toString() + fileExtension;
                        Path filePath = uploadsDir.resolve(storedFileName);
                        
                        // Write the sample content to the file
                        Files.write(filePath, defaultFileContent);
                        
                        System.out.println("Created sample file at: " + filePath.toAbsolutePath());
                        
                        // Calculate file size
                        String size = String.format("%.2f KB", defaultFileContent.length / 1024.0);
                        
                        // Create file record
                        SubjectFile subjectFile = new SubjectFile(
                            fileInfo.getTitle(),
                            originalFileName,
                            fileInfo.getFileType(),
                            size,
                            storedFileName
                        );
                        
                        subjectFile.setSubject(subject);
                        subjectFileRepository.save(subjectFile);
                        
                        System.out.println("Added sample file: " + fileInfo.getTitle() + 
                                          " to subject: " + subjectName);
                    } catch (Exception e) {
                        System.err.println("Failed to create sample file: " + fileInfo.getTitle() + 
                                          " - " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            } else {
                System.err.println("Subject not found: " + subjectName);
            }
        }
        
        System.out.println("Sample files initialization completed.");
    }
    
    // Helper class for sample file information
    private static class SampleFileInfo {
        private final String title;
        private final String fileType;
        private final String resourcePath;
        
        public SampleFileInfo(String title, String fileType, String resourcePath) {
            this.title = title;
            this.fileType = fileType;
            this.resourcePath = resourcePath;
        }
        
        public String getTitle() {
            return title;
        }
        
        public String getFileType() {
            return fileType;
        }
        
        public String getFileName() {
            String fileName = resourcePath.substring(resourcePath.lastIndexOf('/') + 1);
            return fileName;
        }
    }
} 
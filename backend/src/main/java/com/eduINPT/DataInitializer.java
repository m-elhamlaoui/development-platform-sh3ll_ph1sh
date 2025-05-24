package com.eduINPT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.eduINPT.backend.model.Subject;
import com.eduINPT.backend.repository.SubjectRepository;

@Component
@Order(1) // Ensure subjects are created before files
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if we already have subjects in the database
        if (subjectRepository.count() == 0) {
            System.out.println("Initializing subjects...");
            
            // Create subjects
            Subject mathematics = new Subject("Mathematics", "#4CAF50", "Advanced");
            Subject physics = new Subject("Physics", "#2196F3", "Intermediate");
            Subject english = new Subject("English", "#FF9800", "Beginner");
            Subject french = new Subject("French", "#9C27B0", "Beginner");
            Subject arabic = new Subject("Arabic", "#607D8B", "Intermediate");
            Subject chemistry = new Subject("Chemistry", "#FF5722", "Advanced");
            Subject history = new Subject("History", "#795548", "Intermediate");
            Subject computerScience = new Subject("Computer Science", "#009688", "Advanced");

            // Save subjects
            subjectRepository.save(mathematics);
            subjectRepository.save(physics);
            subjectRepository.save(english);
            subjectRepository.save(french);
            subjectRepository.save(arabic);
            subjectRepository.save(chemistry);
            subjectRepository.save(history);
            subjectRepository.save(computerScience);
            
            System.out.println("Subjects initialization completed.");
        } else {
            System.out.println("Subjects already exist. Skipping initialization.");
        }
    }
} 
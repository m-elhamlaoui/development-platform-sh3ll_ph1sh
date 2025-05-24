package com.eduINPT.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "subjects")
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String color;
    private String level;
    
    @OneToMany(mappedBy = "subject")
    private List<SubjectFile> files = new ArrayList<>();
    
    public Subject() {
    }
    
    public Subject(String name, String color, String level) {
        this.name = name;
        this.color = color;
        this.level = level;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
    
    public List<SubjectFile> getFiles() {
        return files;
    }

    public void setFiles(List<SubjectFile> files) {
        this.files = files;
    }
    
    public void addFile(SubjectFile file) {
        files.add(file);
        file.setSubject(this);
    }
} 
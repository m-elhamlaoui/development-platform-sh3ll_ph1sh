package com.eduINPT.backend.repository;

import com.eduINPT.backend.model.SubjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectFileRepository extends JpaRepository<SubjectFile, Long> {
    List<SubjectFile> findBySubjectId(Long subjectId);
    List<SubjectFile> findBySubjectName(String subjectName);
} 
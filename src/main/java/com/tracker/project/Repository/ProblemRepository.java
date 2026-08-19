package com.tracker.project.Repository;

import com.tracker.project.Model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByUsername(String username);
    List<Problem> findByUsernameAndTopic(String username, String topic);
    List<Problem> findByUsernameAndDifficulty(String username, String difficulty);
    List<Problem> findByUsernameAndImportant(String username, boolean important);
    List<Problem> findByUsernameAndTitleContainingIgnoreCase(String username, String title);
    Long countByUsernameAndDifficulty(String username, String difficulty);
    Long countByUsernameAndImportant(String username, boolean important);
    Long countByUsername(String username);

    // keep old ones for backward compat
    List<Problem> findByTopic(String topic);
    List<Problem> findByDifficulty(String difficulty);
    List<Problem> findByImportant(boolean b);
    List<Problem> findByTitleContainingIgnoreCase(String title);
    Long countByDifficulty(String easy);
    Long countByImportant(boolean b);
}

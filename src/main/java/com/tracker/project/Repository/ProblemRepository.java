package com.tracker.project.Repository;

import com.tracker.project.Model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

//Spring automatically provides:
//save()
//findAll()
//findById()
//deleteById()
public interface ProblemRepository extends JpaRepository<Problem,Long> {
    List<Problem> findByTopic(String topic);

    List<Problem> findByDifficulty(String difficulty);

    List<Problem> findByImportant(boolean b);

    List<Problem> findByTitleContainingIgnoreCase(String title);

    Long countByDifficulty(String easy);

    Long countByImportant(boolean b);

    List<Problem> findAllByOrderByDateSolvedAsc();
}

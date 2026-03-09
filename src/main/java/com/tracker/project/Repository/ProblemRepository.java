package com.tracker.project.Repository;

import com.tracker.project.Model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

//Spring automatically provides:
//save()
//findAll()
//findById()
//deleteById()
public interface ProblemRepository extends JpaRepository<Problem,Long> {
}

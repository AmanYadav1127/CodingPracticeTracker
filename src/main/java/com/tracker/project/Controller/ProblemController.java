package com.tracker.project.Controller;

import com.tracker.project.Model.Problem;
import com.tracker.project.Service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @PostMapping("/add")
    public Problem addProblem(@RequestBody Problem problem) {
        return problemService.addProblem(problem);
    }

    @GetMapping("/all")
    public List<Problem> getAllProblems(@RequestParam String username) {
        return problemService.getAllProblems(username);
    }

    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProblem(@PathVariable Long id) {
        problemService.deleteProblemById(id);
        return "Deleted";
    }

    @PutMapping("/update/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody Problem updated) {
        return problemService.updateProblem(id, updated);
    }

    @GetMapping("/streak")
    public Map<String, Object> getStreak(@RequestParam String username) {
        return problemService.getStreak(username);
    }
}

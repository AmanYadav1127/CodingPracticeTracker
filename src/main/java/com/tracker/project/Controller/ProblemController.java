package com.tracker.project.Controller;

import com.tracker.project.Model.Problem;
import com.tracker.project.Service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/api/problems")
public class ProblemController {
    @Autowired
    private ProblemService problemService;

    @PostMapping("/add")
    public Problem addProblem(@RequestBody Problem problem){
        return problemService.addProblem(problem);
    }

    @GetMapping("/all")
    public List<Problem> getAllProblems(){
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable Long id){
        return problemService.getProblemById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProblem(@PathVariable Long id){
        problemService.deleteProblemById(id);
        return "Problem deleted successfully";
    }

    @PutMapping("/update/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody Problem updatedProblem) {
        return problemService.updateProblem(id, updatedProblem);
    }
}

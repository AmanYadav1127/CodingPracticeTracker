package com.tracker.project.Service;

import com.tracker.project.Model.Problem;
import com.tracker.project.Repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;
    //Add problem
    public Problem addProblem(Problem problem){
        return problemRepository.save(problem);
    }
    //Get all problems
    public List<Problem>getAllProblems(){
        return problemRepository.findAll();
    }
    //Get problem by id
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id).orElse(null);
    }
    //Delete problem by id
    public void deleteProblemById(Long id) {
        problemRepository.deleteById(id);
    }
    //Update problem
    public Problem updateProblem(Long id, Problem updatedProblem) {
        Problem existingProblem = problemRepository.findById(id).orElse(null);
        if (existingProblem != null) {
            existingProblem.setTitle(updatedProblem.getTitle());
            existingProblem.setPlatform(updatedProblem.getPlatform());
            existingProblem.setDifficulty(updatedProblem.getDifficulty());
            existingProblem.setTopic(updatedProblem.getTopic());
            existingProblem.setNotes(updatedProblem.getNotes());
            existingProblem.setDateSolved(updatedProblem.getDateSolved());
            return problemRepository.save(existingProblem);
        }
        return null;
    }
}

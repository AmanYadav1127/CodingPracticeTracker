package com.tracker.project.Service;

import com.tracker.project.Model.Problem;
import com.tracker.project.Repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

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
    public List<Problem> getProblemsByTopic(String topic){
        return problemRepository.findByTopic(topic);
    }
    public List<Problem> getProblemsByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty);
    }

    public List<Problem> getImportantProblems() {
        return problemRepository.findByImportant(true);
    }

    public List<Problem> searchByTitle(String title) {
        return problemRepository.findByTitleContainingIgnoreCase(title);
    }

    public Map<String, Long> getStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("total", problemRepository.count());
        stats.put("Easy", problemRepository.countByDifficulty("Easy"));
        stats.put("Medium", problemRepository.countByDifficulty("Medium"));
        stats.put("Hard", problemRepository.countByDifficulty("Hard"));
        stats.put("important", problemRepository.countByImportant(true));

        return stats;
    }

    public Map<String, Object> getStreak() {

        List<Problem> problems = problemRepository.findAllByOrderByDateSolvedAsc();

        Set<LocalDate> uniqueDays = new HashSet<>();

        for (Problem p : problems) {
            uniqueDays.add(LocalDate.parse(p.getDateSolved()));
        }

        List<LocalDate> days = new ArrayList<>(uniqueDays);
        Collections.sort(days);

        int currentStreak = 0;
        int longestStreak = 0;
        int temp = 1;

        for (int i = 1; i < days.size(); i++) {

            if (days.get(i).equals(days.get(i - 1).plusDays(1))) {
                temp++;
            } else {
                longestStreak = Math.max(longestStreak, temp);
                temp = 1;
            }
        }

        longestStreak = Math.max(longestStreak, temp);

        LocalDate today = LocalDate.now();
        LocalDate check = today;

        while (uniqueDays.contains(check)) {
            currentStreak++;
            check = check.minusDays(1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("currentStreak", currentStreak);
        result.put("longestStreak", longestStreak);

        return result;
    }

    public Map<String, Long> getActivity() {

        List<Problem> problems = problemRepository.findAll();

        return problems.stream()
                .collect(Collectors.groupingBy(
                        Problem::getDateSolved,
                        Collectors.counting()
                ));
    }

}

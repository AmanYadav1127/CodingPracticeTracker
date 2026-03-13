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

        List<Problem> problems = problemRepository.findAll();

        Set<LocalDate> solvedDays = new HashSet<>();

        for (Problem p : problems) {

            String dateStr = p.getDateSolved();

            if (dateStr != null && !dateStr.isEmpty()) {

                LocalDate date = LocalDate.parse(dateStr.substring(0, 10));

                solvedDays.add(date);
            }
        }

        int currentStreak = 0;
        int longestStreak = 0;

        LocalDate today = LocalDate.now();

        // CURRENT STREAK

        if (solvedDays.contains(today)) {

            while (solvedDays.contains(today.minusDays(currentStreak))) {
                currentStreak++;
            }

        } else if (solvedDays.contains(today.minusDays(1))) {

            currentStreak = 1;

        }

        // LONGEST STREAK

        List<LocalDate> days = new ArrayList<>(solvedDays);
        Collections.sort(days);

        int count = 1;

        for (int i = 1; i < days.size(); i++) {

            if (days.get(i).equals(days.get(i - 1).plusDays(1))) {

                count++;

            } else {

                longestStreak = Math.max(longestStreak, count);
                count = 1;

            }
        }

        longestStreak = Math.max(longestStreak, count);

        Map<String, Object> result = new HashMap<>();

        result.put("currentStreak", currentStreak);
        result.put("longestStreak", longestStreak);

        return result;
    }

}

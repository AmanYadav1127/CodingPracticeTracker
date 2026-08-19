package com.tracker.project.Service;

import com.tracker.project.Model.Problem;
import com.tracker.project.Repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    public Problem addProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems(String username) {
        return problemRepository.findByUsername(username);
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id).orElse(null);
    }

    public void deleteProblemById(Long id) {
        problemRepository.deleteById(id);
    }

    public Problem updateProblem(Long id, Problem updated) {
        Problem existing = problemRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setPlatform(updated.getPlatform());
            existing.setDifficulty(updated.getDifficulty());
            existing.setTopic(updated.getTopic());
            existing.setNotes(updated.getNotes());
            existing.setDateSolved(updated.getDateSolved());
            existing.setProblemUrl(updated.getProblemUrl());
            existing.setImportant(updated.isImportant());
            existing.setRevision(updated.isRevision());
            return problemRepository.save(existing);
        }
        return null;
    }

    public Map<String, Object> getStreak(String username) {
        List<Problem> problems = problemRepository.findByUsername(username);
        Set<LocalDate> solvedDays = new HashSet<>();

        for (Problem p : problems) {
            String dateStr = p.getDateSolved();
            if (dateStr != null && !dateStr.isEmpty()) {
                solvedDays.add(LocalDate.parse(dateStr.substring(0, 10)));
            }
        }

        int currentStreak = 0;
        LocalDate today = LocalDate.now();

        if (solvedDays.contains(today)) {
            while (solvedDays.contains(today.minusDays(currentStreak))) currentStreak++;
        } else if (solvedDays.contains(today.minusDays(1))) {
            currentStreak = 1;
        }

        List<LocalDate> days = new ArrayList<>(solvedDays);
        Collections.sort(days);
        int longestStreak = 0, count = days.isEmpty() ? 0 : 1;
        for (int i = 1; i < days.size(); i++) {
            if (days.get(i).equals(days.get(i - 1).plusDays(1))) count++;
            else { longestStreak = Math.max(longestStreak, count); count = 1; }
        }
        longestStreak = Math.max(longestStreak, count);

        Map<String, Object> result = new HashMap<>();
        result.put("currentStreak", currentStreak);
        result.put("longestStreak", longestStreak);
        return result;
    }
}

package com.tracker.project.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
// @Entity → tells Spring it's a table
//@Id → primary key
//@GeneratedValue → auto increment id
@Data
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String platform;
    private String difficulty;
    private String topic;
    private String dateSolved;
    private String notes;
    private String problemUrl;
    private boolean important;
    private boolean revision;
}
